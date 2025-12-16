import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Header } from "../../../shared/header/header";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home.page',
  standalone: true,
  imports: [RouterLink, Header, CommonModule],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {

  stats = [
    { label: 'Active Students', value: '10k+' },
    { label: 'Expert Mentors', value: '100+' },
    { label: 'Courses', value: '50+' },
    { label: 'Satisfaction', value: '4.9/5' }
  ];

  features = [
    {
      icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
      title: 'Interactive Learning',
      desc: 'Engage with dynamic content, quizzes, and hands-on projects designed to reinforce your skills.'
    },
    {
      icon: 'M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 2.625a4.25 4.25 0 00-7.5 0m7.5 0v-3a2.25 2.25 0 10-4.5 0v3m13.125-9.75l-4.663 14H5.537l-4.663-14H12zm11.25 0v14.25',
      title: 'Flexible Schedule',
      desc: 'Learn at your own pace, anytime, anywhere. Your education fits around your life, not the other way around.'
    },
    {
      icon: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z',
      title: 'Certified Mentors',
      desc: 'Gain insights from industry professionals and certified experts who are passionate about teaching.'
    }
  ];

  courses = [
    {
      title: 'Full-Stack Development',
      image: 'assets/images/course-programming.png',
      category: 'Development',
      students: '4.5k',
      rating: 4.8,
      price: '$89'
    },
    {
      title: 'Digital Product Design',
      image: 'assets/images/course-design.png',
      category: 'Design',
      students: '3.2k',
      rating: 4.9,
      price: '$79'
    },
    {
      title: 'Business Analytics 101',
      image: 'assets/images/course-business.png',
      category: 'Business',
      students: '5.1k',
      rating: 4.7,
      price: '$99'
    }
  ];

  testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Frontend Developer',
      content: 'This platform completely transformed my career. The courses are practical, up-to-date, and the mentors are incredibly helpful.',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=0D8ABC&color=fff'
    },
    {
      name: 'Michael Chen',
      role: 'UX Designer',
      content: 'I loved the flexibility. Being able to learn at my own pace while working a full-time job was exactly what I needed.',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=6366f1&color=fff'
    },
    {
      name: 'Emily Davis',
      role: 'Data Analyst',
      content: 'The depth of the content is amazing. I learned more in 3 months here than I did in a year of self-study.',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=10b981&color=fff'
    }
  ];
}
