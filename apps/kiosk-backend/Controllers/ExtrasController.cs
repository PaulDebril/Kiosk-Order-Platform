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
    public async Task<IActionResult> GetAll()
    {
        var extras = await _service.GetAllAsync();
        return Ok(extras);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Extra extra)
    {
        var created = await _service.CreateAsync(extra);
        return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
    }
}
