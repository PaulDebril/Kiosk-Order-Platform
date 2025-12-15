public class OrderService : IOrderService
{
    private readonly FakeDb _db;
    private readonly ILoyaltyService _loyaltyService;

    public OrderService(FakeDb db, ILoyaltyService loyaltyService)
    {
        _db = db;
        _loyaltyService = loyaltyService;
    }

    public IEnumerable<Order> GetAll() => _db.Orders;

    public Order? GetById(Guid id) =>
        _db.Orders.FirstOrDefault(o => o.Id == id);

    public Order Create(Order o)
    {
        o.Id = Guid.NewGuid();
        o.CreatedAt = DateTime.UtcNow;

        decimal total = 0;

        foreach (var item in o.Items)
        {
            var product = _db.Products.FirstOrDefault(p => p.Id == item.ProductId);
            if (product == null) continue;

            decimal price = product.BasePrice;

            if (item.ExtraIds != null)
            {
                foreach (var extraId in item.ExtraIds)
                {
                    var extra = _db.Extras.FirstOrDefault(e => e.Id == extraId);
                    if (extra != null)
                        price += extra.Price;
                }
            }

            if (item.SelectedOptions != null)
            {
                foreach (var opt in item.SelectedOptions)
                    price += opt.AdditionalPrice;
            }

            total += price * item.Quantity;
        }

        o.TotalPrice = total;

        _db.Orders.Add(o);

        if (o.LoyaltyAccountId != null)
        {
            var acc = _loyaltyService.GetById(o.LoyaltyAccountId.Value);

            if (acc != null)
            {
                acc.OrderHistory.Add(o.Id);
                _loyaltyService.AddPoints(acc.Id, total);
            }
        }

        return o;
    }
}
