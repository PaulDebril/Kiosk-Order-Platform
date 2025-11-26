using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("categories")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _service;

    public CategoriesController(ICategoryService service)
    {
        _service = service;
    }

    [HttpGet]
    public IActionResult GetAll() =>
        Ok(_service.GetAll());

    [HttpPost]
    public IActionResult Create(Category c)
    {
        var created = _service.Create(c);
        return Ok(created);
    }
}
