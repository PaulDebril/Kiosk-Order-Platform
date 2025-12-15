using Microsoft.EntityFrameworkCore;

public class ExtraService : IExtraService
{
    private readonly ApplicationDbContext _context;

    public ExtraService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Extra>> GetAllAsync()
    {
        return await _context.Extras.ToListAsync();
    }

    public async Task<Extra?> GetByIdAsync(Guid id)
    {
        return await _context.Extras.FindAsync(id);
    }

    public async Task<Extra> CreateAsync(Extra extra)
    {
        extra.Id = Guid.NewGuid();
        _context.Extras.Add(extra);
        await _context.SaveChangesAsync();
        return extra;
    }

    public async Task<bool> UpdateAsync(Guid id, Extra extra)
    {
        var existing = await _context.Extras.FindAsync(id);
        if (existing == null) return false;

        existing.Name = extra.Name;
        existing.Price = extra.Price;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var extra = await _context.Extras.FindAsync(id);
        if (extra == null) return false;

        _context.Extras.Remove(extra);
        await _context.SaveChangesAsync();
        return true;
    }
}
