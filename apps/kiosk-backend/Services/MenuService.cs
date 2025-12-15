using Microsoft.EntityFrameworkCore;

public class MenuService : IMenuService
{
    private readonly ApplicationDbContext _context;

    public MenuService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Menu>> GetAllAsync()
    {
        return await _context.Menus.ToListAsync();
    }

    public async Task<Menu?> GetByIdAsync(Guid id)
    {
        return await _context.Menus.FindAsync(id);
    }

    public async Task<Menu> CreateAsync(Menu menu)
    {
        menu.Id = Guid.NewGuid();
        _context.Menus.Add(menu);
        await _context.SaveChangesAsync();
        return menu;
    }

    public async Task<bool> UpdateAsync(Guid id, Menu menu)
    {
        var existing = await _context.Menus.FindAsync(id);
        if (existing == null) return false;

        existing.Title = menu.Title;
        existing.Price = menu.Price;
        existing.MainProductId = menu.MainProductId;
        existing.DrinkProductId = menu.DrinkProductId;
        existing.SideProductId = menu.SideProductId;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var menu = await _context.Menus.FindAsync(id);
        if (menu == null) return false;

        _context.Menus.Remove(menu);
        await _context.SaveChangesAsync();
        return true;
    }
}
