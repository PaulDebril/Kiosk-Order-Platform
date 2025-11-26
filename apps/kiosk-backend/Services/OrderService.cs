public class OrderService : IOrderService
{
    private readonly FakeDb _db;

    public OrderService(FakeDb db)
    {
        _db = db;
    }

    public Order Create(Order order)
    {
        order.Id = Guid.NewGuid();
        _db.Orders.Add(order);
        return order;
    }

    public Order? GetById(Guid id) =>
        _db.Orders.FirstOrDefault(o => o.Id == id);

    public IEnumerable<Order> GetAll() => _db.Orders;
}
