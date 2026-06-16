package com.smartsplit.backend.controller;

import com.smartsplit.backend.entity.Expense;
import com.smartsplit.backend.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    // GET endpoint for expenses
    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    // POST endpoint for new expense
    @PostMapping
    public Expense createExpense(@RequestBody Expense expense) {
        return expenseService.saveExpense(expense);
    }

    // GET endpoint for balances (Who owes whom)
    @GetMapping("/balances")
    public Map<String, Double> getAllBalances() {
        return expenseService.calculateBalances();
    }

    // DELETE endpoint to remove an expense
    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
    }
}