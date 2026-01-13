public interface ILoyaltyService
{
    Task<LoyaltyAccount?> GetAccountByNumberAsync(string loyaltyNumber);
    Task<LoyaltyAccount?> ValidateAndGetAccountAsync(string loyaltyCode); 
    Task<LoyaltyAccount> CreateAccountAsync(LoyaltyAccount account);
    Task<bool> AddPointsAsync(Guid accountId, int points, string reason);
    Task<bool> RedeemPointsAsync(Guid accountId, int points);
    Task<List<LoyaltyTransaction>> GetTransactionsAsync(Guid accountId);
}
