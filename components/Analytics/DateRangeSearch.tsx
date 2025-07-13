"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Search } from "lucide-react";

interface DateRangeSearchProps {
  onDateRangeChange: (fromDate: Date, toDate: Date) => void;
}

const DateRangeSearch: React.FC<DateRangeSearchProps> = ({ onDateRangeChange }) => {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Set default date range (last 7 days)
  useEffect(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    setFromDate(sevenDaysAgo.toISOString().split('T')[0]);
    setToDate(today.toISOString().split('T')[0]);
  }, []);

  const handleSearch = () => {
    if (!fromDate || !toDate) {
      setError("Please select both from and to dates");
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (from > to) {
      setError("From date cannot be after to date");
      return;
    }

    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      setError("Date range cannot exceed 30 days");
      return;
    }

    setError("");
    onDateRangeChange(from, to);
  };

  const handleReset = () => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    setFromDate(sevenDaysAgo.toISOString().split('T')[0]);
    setToDate(today.toISOString().split('T')[0]);
    setError("");
    onDateRangeChange(sevenDaysAgo, today);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Date Range Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="fromDate">From Date</Label>
            <Input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              max={toDate || undefined}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toDate">To Date</Label>
            <Input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate || undefined}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
        <p className="text-gray-500 text-sm mt-2">
          Maximum date range: 30 days
        </p>
      </CardContent>
    </Card>
  );
};

export default DateRangeSearch; 