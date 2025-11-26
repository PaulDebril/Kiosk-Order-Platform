public class MenuItem
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public decimal Price { get; set; }
    public List<Guid> ProductIds { get; set; } = new();
}
