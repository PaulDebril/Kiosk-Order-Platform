public class OptionChoice
{
    public string Id { get; set; } = Guid.NewGuid().ToString(); // Frontend expects string ID
    public string Name { get; set; } = ""; // ex: "M", "L", "Avec glaçons"
    public decimal Price { get; set; } = 0m;
}

