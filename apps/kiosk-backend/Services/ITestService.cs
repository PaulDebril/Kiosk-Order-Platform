public interface ITestService
{
    TestMessage GetPing();
    TestMessage GetHello(string name);
}
