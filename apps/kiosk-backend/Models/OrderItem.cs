public class OrderItem
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public int Quantity { get; set; } = 1;

    public List<Guid> RemovedIngredients { get; set; } = new();
    public List<Guid> ExtraIds { get; set; } = new();
    public List<OptionChoice> SelectedOptions { get; set; } = new();
}
