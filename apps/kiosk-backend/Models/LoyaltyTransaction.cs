public class LoyaltyTransaction
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AccountId { get; set; }
    public int PointsChanged { get; set; }
    public string Reason { get; set; } = "";
    public DateTime Date { get; set; } = DateTime.UtcNow;
}
