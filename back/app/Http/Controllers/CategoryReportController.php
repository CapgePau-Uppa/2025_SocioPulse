<?php

namespace App\Http\Controllers;

use App\Models\CategoryReport;
use Illuminate\Http\Request;

class CategoryReportController extends Controller
{
    public function index()
    {
        $categories = CategoryReport::all();
        return view('category_reports.index', compact('categories'));
    }

    public function create()
    {
        return view('category_reports.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'name' => 'required|string|max:255',
        ]);

        CategoryReport::create($request->all());

        return redirect()->route('category_reports.index')->with('success', 'Category created successfully.');
    }

    public function show(CategoryReport $categoryReport)
    {
        return view('category_reports.show', compact('categoryReport'));
    }

    public function edit(CategoryReport $categoryReport)
    {
        return view('category_reports.edit', compact('categoryReport'));
    }

    public function update(Request $request, CategoryReport $categoryReport)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $categoryReport->update($request->all());

        return redirect()->route('category_reports.index')->with('success', 'Category updated successfully.');
    }

    public function destroy(CategoryReport $categoryReport)
    {
        $categoryReport->delete();

        return redirect()->route('category_reports.index')->with('success', 'Category deleted successfully.');
    }
}
