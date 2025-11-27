public class LoyaltyService : ILoyaltyService
{
    private readonly FakeDb _db;

    public LoyaltyService(FakeDb db)
    {
        _db = db;
    }

    public LoyaltyAccount? GetByQrCode(string qr) =>
        _db.LoyaltyAccounts.FirstOrDefault(a => a.LoyaltyNumber == qr);

    public LoyaltyAccount? GetById(Guid id) =>
        _db.LoyaltyAccounts.FirstOrDefault(a => a.Id == id);

    public LoyaltyAccount Create(LoyaltyAccount acc)
    {
        acc.Id = Guid.NewGuid();
        acc.LoyaltyNumber = $"QR-{acc.Id.ToString().Substring(0, 6).ToUpper()}";
        _db.LoyaltyAccounts.Add(acc);
        return acc;
    }

    public LoyaltyAccount AddPoints(Guid id, decimal total)
    {
        var acc = GetById(id);
        if (acc == null) return null;

        int points = (int)(total * _db.LoyaltyRule.PointsPerEuro);

        acc.Points += points;

        _db.LoyaltyTransactions.Add(new LoyaltyTransaction
        {
            AccountId = acc.Id,
            PointsChanged = points,
            Reason = "Commande",
        });

        return acc;
    }

    public LoyaltyAccount SpendPoints(Guid id, int points)
    {
        var acc = GetById(id);
        if (acc == null) return null;

        acc.Points -= points;

        _db.LoyaltyTransactions.Add(new LoyaltyTransaction
        {
            AccountId = acc.Id,
            PointsChanged = -points,
            Reason = "Dépense de points",
        });

        return acc;
    }

    public IEnumerable<LoyaltyTransaction> GetTransactions(Guid id) =>
        _db.LoyaltyTransactions.Where(t => t.AccountId == id);
}
