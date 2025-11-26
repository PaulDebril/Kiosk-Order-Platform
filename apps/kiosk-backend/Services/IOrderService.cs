public interface IOrderService
{
    Order Create(Order order);
    Order? GetById(Guid id);
    IEnumerable<Order> GetAll();
}
