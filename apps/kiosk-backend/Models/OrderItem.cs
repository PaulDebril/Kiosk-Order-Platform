public class OrderItem
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; } = 1;

    public List<Guid>? RemovedIngredients { get; set; }
    public List<Guid>? ExtraIds { get; set; }
    public List<OptionChoice>? SelectedOptions { get; set; }
}
