using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("orders")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _service;

    public OrdersController(IOrderService service)
    {
        _service = service;
    }

    [HttpPost]
    public IActionResult Create(Order o)
    {
        var created = _service.Create(o);
        return Ok(created); 
    }

    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var order = _service.GetById(id);
        return order == null ? NotFound() : Ok(order);
    }

    [HttpGet]
    public IActionResult GetAll() =>
        Ok(_service.GetAll());
}
