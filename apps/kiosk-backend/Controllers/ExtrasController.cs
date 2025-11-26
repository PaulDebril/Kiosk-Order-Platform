using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("extras")]
public class ExtrasController : ControllerBase
{
    private readonly IExtraService _service;

    public ExtrasController(IExtraService service)
    {
        _service = service;
    }

    [HttpGet]
    public IActionResult GetAll() => Ok(_service.GetAll());

    [HttpPost]
    public IActionResult Create(Extra e) => Ok(_service.Create(e));
}
