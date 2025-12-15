using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("ingredients")]
public class IngredientsController : ControllerBase
{
    private readonly IIngredientService _service;

    public IngredientsController(IIngredientService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var ingredients = await _service.GetAllAsync();
        return Ok(ingredients);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Ingredient ingredient)
    {
        var created = await _service.CreateAsync(ingredient);
        return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
    }
}
