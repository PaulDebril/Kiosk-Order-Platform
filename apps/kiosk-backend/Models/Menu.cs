public class Menu
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public decimal Price { get; set; }

    public Guid MainProductId { get; set; }
    public Guid DrinkProductId { get; set; }
    public Guid SideProductId { get; set; }
}
