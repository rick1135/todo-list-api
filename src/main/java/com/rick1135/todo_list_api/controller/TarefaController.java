package com.rick1135.todo_list_api.controller;

import com.rick1135.todo_list_api.model.Tarefa;
import com.rick1135.todo_list_api.service.TarefaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tarefas")
public class TarefaController {
    private final TarefaService service;

    public TarefaController(TarefaService service){
        this.service = service;
    }

    @PostMapping
    public Tarefa create(@RequestBody Tarefa tarefa){
        return service.criar(tarefa);
    }

    @GetMapping
    public List<Tarefa> list(){
        return service.listar();
    }

    @PutMapping
    public Tarefa update(@RequestBody Tarefa tarefa){
        return service.atualizar(tarefa);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.deletar(id);
    }
}
