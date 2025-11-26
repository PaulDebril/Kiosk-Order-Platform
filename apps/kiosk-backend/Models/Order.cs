public class Order
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public List<OrderItem> Items { get; set; } = new();
    public decimal TotalPrice { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
