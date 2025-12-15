public class LoyaltyAccount
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = "";
    public string Email { get; set; } = "";
    public string PhoneNumber { get; set; } = "";
    public string LoyaltyNumber { get; set; } = ""; 

    public int Points { get; set; } = 0;

    public List<Guid> OrderHistory { get; set; } = new(); 
}
