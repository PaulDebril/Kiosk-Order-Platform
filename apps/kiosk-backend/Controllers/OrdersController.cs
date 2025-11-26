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

    [HttpGet]
    public IActionResult GetAll() => Ok(_service.GetAll());

    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var o = _service.GetById(id);
        return o == null ? NotFound() : Ok(o);
    }

    [HttpPost]
    public IActionResult Create(Order o) => Ok(_service.Create(o));
}
