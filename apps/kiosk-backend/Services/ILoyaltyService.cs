public interface ILoyaltyService
{
    LoyaltyAccount? GetByQrCode(string qr);
    LoyaltyAccount? GetById(Guid id);
    LoyaltyAccount Create(LoyaltyAccount acc);
    LoyaltyAccount AddPoints(Guid id, decimal orderTotal);
    LoyaltyAccount SpendPoints(Guid id, int points);
    IEnumerable<LoyaltyTransaction> GetTransactions(Guid id);
}
