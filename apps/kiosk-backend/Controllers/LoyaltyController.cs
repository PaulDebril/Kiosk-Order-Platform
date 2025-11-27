using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("loyalty")]
public class LoyaltyController : ControllerBase
{
    private readonly ILoyaltyService _service;

    public LoyaltyController(ILoyaltyService service)
    {
        _service = service;
    }

    [HttpGet("scan/{qr}")]
    public IActionResult Scan(string qr)
    {
        var acc = _service.GetByQrCode(qr);
        return acc == null ? NotFound() : Ok(acc);
    }

    [HttpGet("{id}/transactions")]
    public IActionResult Transactions(Guid id) =>
        Ok(_service.GetTransactions(id));

    [HttpPost]
    public IActionResult Create(LoyaltyAccount acc) =>
        Ok(_service.Create(acc));

    [HttpPost("{id}/addPoints")]
    public IActionResult AddPoints(Guid id, [FromQuery] decimal total)
    {
        var acc = _service.AddPoints(id, total);
        return acc == null ? NotFound() : Ok(acc);
    }

    [HttpPost("{id}/spend")]
    public IActionResult Spend(Guid id, [FromQuery] int points)
    {
        var acc = _service.SpendPoints(id, points);
        return acc == null ? NotFound() : Ok(acc);
    }
}
