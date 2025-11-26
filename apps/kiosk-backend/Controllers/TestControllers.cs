using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class TestController : ControllerBase
{
    private readonly ITestService _service;

    public TestController(ITestService service)
    {
        _service = service;
    }

    [HttpGet("ping")]
    public IActionResult Ping()
    {
        var response = _service.GetPing();
        return Ok(response);
    }

    [HttpGet("hello/{name}")]
    public IActionResult Hello(string name)
    {
        var response = _service.GetHello(name);
        return Ok(response);
    }
}
