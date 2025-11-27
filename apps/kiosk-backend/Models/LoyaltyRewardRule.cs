public class LoyaltyRewardRule
{
    public decimal MoneyPerPoint { get; set; } = 1m; // 1€ = 1 point
    public int PointsPerEuro { get; set; } = 5; // 1€ = 5 points
    public int FreeItemThreshold { get; set; } = 500; // Burger gratuit
}
