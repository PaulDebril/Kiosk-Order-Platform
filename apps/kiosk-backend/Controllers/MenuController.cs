using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("menu")]
public class MenuController : ControllerBase
{
    private readonly IMenuService _service;

    public MenuController(IMenuService service)
    {
        _service = service;
    }

    [HttpGet]
    public IActionResult GetAll() =>
        Ok(_service.GetAll());

    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var item = _service.GetById(id);
        return item == null ? NotFound() : Ok(item);
    }
}
