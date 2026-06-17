package com.smartsplit.backend.service;

import com.smartsplit.backend.entity.Expense;
import com.smartsplit.backend.entity.User;
import com.smartsplit.backend.repository.ExpenseRepository;
import com.smartsplit.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository; // Added to get user count

    // Fetch all expenses
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    // Save a new expense
    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    // CORE LOGIC: Calculate who owes how much
    public Map<String, Double> calculateBalances() {
        List<User> users = userRepository.findAll();
        List<Expense> expenses = expenseRepository.findAll();

        Map<String, Double> balances = new HashMap<>();
        if (users.isEmpty()) return balances; // No users, no balances

        // 1. Initialize everyone's balance to 0.0
        for (User user : users) {
            balances.put(user.getName(), 0.0);
        }

        // 2. Process each expense
        for (Expense exp : expenses) {
            // Skip old data that doesn't have participants yet to prevent crashes
            if (exp.getParticipants() == null || exp.getParticipants().isEmpty()) continue;

            double amount = exp.getAmount().doubleValue();
            String payerName = exp.getPaidBy().getName();
            int participantCount = exp.getParticipants().size();
            double splitAmount = amount / participantCount;

            // The payer gets the full amount added to their balance
            balances.put(payerName, balances.get(payerName) + amount);

            // Everyone who participated gets the split amount subtracted from their balance
            for (User participant : exp.getParticipants()) {
                String pName = participant.getName();
                balances.put(pName, balances.get(pName) - splitAmount);
            }
        }

        // 3. Round everything to 2 decimal places (e.g., 12.75)
        balances.replaceAll((name, balance) -> Math.round(balance * 100.0) / 100.0);

        return balances;
    }
    // Delete an expense by ID
    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}