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
    public async Task<IActionResult> GetAll()
    {
        var menus = await _service.GetAllAsync();
        return Ok(menus);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var menu = await _service.GetByIdAsync(id);
        if (menu == null) return NotFound();
        return Ok(menu);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Menu menu)
    {
        var created = await _service.CreateAsync(menu);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}
