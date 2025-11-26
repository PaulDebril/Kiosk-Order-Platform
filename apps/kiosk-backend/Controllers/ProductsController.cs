using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _service;

    public ProductsController(IProductService service)
    {
        _service = service;
    }

    [HttpGet]
    public IActionResult GetAll() => Ok(_service.GetAll());

    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var p = _service.GetById(id);
        return p == null ? NotFound() : Ok(p);
    }

    [HttpPost]
    public IActionResult Create(Product product)
    {
        var created = _service.Create(product);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public IActionResult Update(Guid id, Product p)
    {
        var updated = _service.Update(id, p);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        return _service.Delete(id) ? NoContent() : NotFound();
    }
}
