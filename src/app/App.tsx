import {
  VacanciesPage,
  VacancyPage,
  ErrorPage,
  AboutMe,
} from '../pages/vacancies';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from './Layout';

export default function App() {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.overflowY;
    root.style.overflowY = 'scroll';
    return () => {
      root.style.overflowY = prev;
    };
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="vacancies" replace />} />
        <Route path="vacancies" element={<VacanciesPage />} />
        <Route path="vacancies/:id" element={<VacancyPage />} />
        <Route path="about" element={<AboutMe />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}
