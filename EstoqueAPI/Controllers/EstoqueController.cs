using EstoqueAPI.Context;
using EstoqueAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace EstoqueAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EstoqueController : ControllerBase
    {
        private readonly EstoqueContext _context;

        public EstoqueController(EstoqueContext context)
        {
            _context = context;
        }

        [HttpPost()]
        public IActionResult AdicionarEstoque(Estoque item)
        {
            if (item.Quantidade <= 0)
            {
                return BadRequest("A quantidade do produto deve ser maior que 0.");
            }

            _context.Add(item);
            _context.SaveChanges();
            return CreatedAtAction(nameof(AdicionarEstoque), new { id = item.Id }, item);
        }

        [HttpGet("VisualizarEstoque")]
        public IActionResult VisualizarEstoque()
        {

            var Estoque = _context.Estoques.ToList();


            return Ok(Estoque);
        }

        [HttpGet("PesquisarNoEstoque")]
        public IActionResult PesquisarItem([FromQuery] string nome)
        {

            var itensEncontrados = _context.Estoques.Where(x => x.Nome.ToLower().Contains(nome)).ToList();

            if (itensEncontrados.Count > 0)
            {
                return Ok(itensEncontrados);
            }
            else
            {
                return NotFound("Nenhum item com este nome no estoque");
            }

        }

        [HttpDelete("{id}")]
        public IActionResult RetirarItem(int id, [FromQuery] double quantidade)
        {

            var item = _context.Estoques.Find(id);

            if (item == null)
            {
                return NotFound("Item não encontrado");
            }
            if (item.Quantidade < quantidade)
            {
                return BadRequest("Quantidade a ser removida maior que a quantidade no estoque");
            }

            if (quantidade <= 0 || quantidade > item.Quantidade)
            {
                _context.Estoques.Remove(item);
                _context.SaveChanges();
            }

            item.Quantidade -= quantidade;

            if (item.Quantidade == 0)
            {
                _context.Estoques.Remove(item);
            }

            var itensZerados = _context.Estoques.Where(x => x.Quantidade == 0).ToList();
            _context.Estoques.RemoveRange(itensZerados);


            _context.SaveChanges();
            return Ok(new { mensagem = $"Retirada de '{quantidade}' unidades do item '{item.Nome}' do estoque" });

        }
    }
}
