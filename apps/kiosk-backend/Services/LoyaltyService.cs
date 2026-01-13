using Microsoft.EntityFrameworkCore;

public class LoyaltyService : ILoyaltyService
{
    private readonly ApplicationDbContext _context;

    public LoyaltyService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<LoyaltyAccount?> GetAccountByNumberAsync(string loyaltyNumber)
    {
        return await _context.LoyaltyAccounts
            .FirstOrDefaultAsync(la => la.LoyaltyNumber == loyaltyNumber);
    }

    public async Task<LoyaltyAccount?> ValidateAndGetAccountAsync(string loyaltyCode)
    {
        return await _context.LoyaltyAccounts
            .FirstOrDefaultAsync(la => la.LoyaltyNumber == loyaltyCode);
    }

    public async Task<LoyaltyAccount> CreateAccountAsync(LoyaltyAccount account)
    {
        account.Id = Guid.NewGuid();
        account.LoyaltyNumber = $"QR-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";
        account.Points = 0;
        account.OrderHistory = new List<Guid>();

        _context.LoyaltyAccounts.Add(account);
        await _context.SaveChangesAsync();
        return account;
    }

    public async Task<bool> AddPointsAsync(Guid accountId, int points, string reason)
    {
        var account = await _context.LoyaltyAccounts.FindAsync(accountId);
        if (account == null) return false;

        account.Points += points;

        var transaction = new LoyaltyTransaction
        {
            Id = Guid.NewGuid(),
            AccountId = accountId,
            PointsChanged = points,
            Reason = reason,
            Date = DateTime.UtcNow
        };

        _context.LoyaltyTransactions.Add(transaction);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RedeemPointsAsync(Guid accountId, int points)
    {
        var account = await _context.LoyaltyAccounts.FindAsync(accountId);
        if (account == null || account.Points < points) return false;

        account.Points -= points;

        var transaction = new LoyaltyTransaction
        {
            Id = Guid.NewGuid(),
            AccountId = accountId,
            PointsChanged = -points,
            Reason = "Rédemption",
            Date = DateTime.UtcNow
        };

        _context.LoyaltyTransactions.Add(transaction);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<LoyaltyTransaction>> GetTransactionsAsync(Guid accountId)
    {
        return await _context.LoyaltyTransactions
            .Where(lt => lt.AccountId == accountId)
            .OrderByDescending(lt => lt.Date)
            .ToListAsync();
    }
}
