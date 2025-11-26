using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("menus")]
public class MenusController : ControllerBase
{
    private readonly IMenuService _service;

    public MenusController(IMenuService service)
    {
        _service = service;
    }

    [HttpGet]
    public IActionResult GetAll() => Ok(_service.GetAll());

    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var m = _service.GetById(id);
        return m == null ? NotFound() : Ok(m);
    }

    [HttpPost]
    public IActionResult Create(Menu m) => Ok(_service.Create(m));
}
