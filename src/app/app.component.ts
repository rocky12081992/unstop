import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  seats: number[][]; // 2D array to represent seats
  totalSeats = 80;
  bookedSeats = 0;
  bookingResult: string[] = []; // Stores seat numbers booked in the last operation

  constructor() {
    // Initialize the seat layout: 10 rows of 7 seats each, last row with 3 seats
    this.seats = Array.from({ length: 10 }, () => Array(7).fill(0))
      .concat([Array(3).fill(0)]);
  }

  // Display layout in the console for debugging (optional)
  logSeatLayout() {
    console.log("\nCoach Seat Layout (0 = available, 1 = booked):");
    this.seats.forEach((row, index) => {
      console.log(`Row ${index + 1}: ` + row.map(seat => (seat === 0 ? "O" : "X")).join(" "));
    });
  }

  // Finds consecutive available seats in a row
  findConsecutiveSeats(row: number[], numSeats: number): number {
    for (let start = 0; start <= row.length - numSeats; start++) {
      if (row.slice(start, start + numSeats).every(seat => seat === 0)) {
        return start;
      }
    }
    return -1;
  }

  // Books seats based on user input
  bookSeats(numSeats: number) {
    if (this.bookedSeats + numSeats > this.totalSeats) {
      this.bookingResult = ["Not enough seats available."];
      return;
    }

    let seatsToBook: string[] = [];
    // Try to find consecutive seats in a single row
    for (let i = 0; i < this.seats.length; i++) {
      const start = this.findConsecutiveSeats(this.seats[i], numSeats);
      if (start !== -1) {
        for (let j = start; j < start + numSeats; j++) {
          this.seats[i][j] = 1; // Mark as booked
          seatsToBook.push(`Row ${i + 1} Seat ${j + 1}`);
        }
        this.bookedSeats += numSeats;
        this.bookingResult = seatsToBook;
        this.logSeatLayout();
        return;
      }
    }

    // If consecutive seats aren't available, find nearby seats across rows
    for (let i = 0; i < this.seats.length && numSeats > 0; i++) {
      for (let j = 0; j < this.seats[i].length && numSeats > 0; j++) {
        if (this.seats[i][j] === 0) {
          this.seats[i][j] = 1; // Mark as booked
          seatsToBook.push(`Row ${i + 1} Seat ${j + 1}`);
          numSeats--;
          this.bookedSeats++;
        }
      }
    }

    this.bookingResult = seatsToBook;
    this.logSeatLayout();
  }
}
