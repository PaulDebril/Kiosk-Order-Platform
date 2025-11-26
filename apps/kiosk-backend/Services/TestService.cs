public class TestService : ITestService
{
    public TestMessage GetPing()
    {
        return new TestMessage("Pong");
    }

    public TestMessage GetHello(string name)
    {
        return new TestMessage($"Hello {name}, API is working!");
    }
}
