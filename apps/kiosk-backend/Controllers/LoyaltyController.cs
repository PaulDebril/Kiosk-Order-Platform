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

    [HttpGet("qr/{qrCode}")]
    public async Task<IActionResult> GetByQrCode(string qrCode)
    {
        var account = await _service.GetAccountByNumberAsync(qrCode);
        if (account == null) return NotFound();
        
        var transactions = await _service.GetTransactionsAsync(account.Id);
        return Ok(new { account, transactions });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Create([FromBody] LoyaltyAccount account)
    {
        var created = await _service.CreateAccountAsync(account);
        return Ok(created);
    }

    [HttpPost("{accountId}/points")]
    public async Task<IActionResult> AddPoints(Guid accountId, [FromBody] AddPointsRequest request)
    {
        var points = (int)(request.Amount * 10);
        var success = await _service.AddPointsAsync(accountId, points, "Commande");
        if (!success) return NotFound();
        return Ok();
    }

    [HttpPost("{accountId}/redeem")]
    public async Task<IActionResult> RedeemPoints(Guid accountId, [FromBody] RedeemPointsRequest request)
    {
        var success = await _service.RedeemPointsAsync(accountId, request.Points);
        if (!success) return BadRequest("Points insuffisants ou compte introuvable");
        return Ok();
    }
}

public record AddPointsRequest(decimal Amount);
public record RedeemPointsRequest(int Points);
