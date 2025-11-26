public class OrderService : IOrderService
{
    private readonly FakeDb _db;

    public OrderService(FakeDb db)
    {
        _db = db;
    }

    public IEnumerable<Order> GetAll() => _db.Orders;

    public Order? GetById(Guid id) =>
        _db.Orders.FirstOrDefault(o => o.Id == id);

    public Order Create(Order o)
    {
        o.Id = Guid.NewGuid();
        o.CreatedAt = DateTime.UtcNow;

        // CALCUL DU PRIX TOTAL
        decimal total = 0;

        foreach (var item in o.Items)
        {
            var product = _db.Products.FirstOrDefault(p => p.Id == item.ProductId);
            if (product == null) continue;

            decimal price = product.BasePrice;

            // Extras (sauces, add-ons)
            if (item.ExtraIds != null)
            {
                foreach (var extraId in item.ExtraIds)
                {
                    var extra = _db.Extras.FirstOrDefault(e => e.Id == extraId);
                    if (extra != null)
                        price += extra.Price;
                }
            }

            // Options (taille boisson, glaces…)
            if (item.SelectedOptions != null)
            {
                foreach (var opt in item.SelectedOptions)
                    price += opt.AdditionalPrice;
            }

            total += price * item.Quantity;
        }

        o.TotalPrice = total;

        _db.Orders.Add(o);
        return o;
    }
}
