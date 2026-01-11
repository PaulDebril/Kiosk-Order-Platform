public class ProductOption
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = "";
    public string Type { get; set; } = "single"; // single / multiple
    public bool Required { get; set; }
    public int? MaxQuantity { get; set; }
    public List<OptionChoice> Options { get; set; } = new();
}

