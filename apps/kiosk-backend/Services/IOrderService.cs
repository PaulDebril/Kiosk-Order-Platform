public interface IOrderService
{
    IEnumerable<Order> GetAll();
    Order? GetById(Guid id);
    Order Create(Order o);
}
