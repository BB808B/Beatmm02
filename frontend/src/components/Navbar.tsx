'use client';

import React, { useState } from 'react';
import { Navbar, Nav, Container, Dropdown, Form, Button } from 'react-bootstrap';
import { FaSearch, FaUser, FaMusic, FaHome, FaTrophy, FaBroadcastTower, FaFileContract } from 'react-icons/fa';
import { NavbarProps, Language } from '@/types';

const NavbarComponent: React.FC<NavbarProps> = ({ 
  currentLang, 
  onLanguageChange, 
  translations 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const languages: Language[] = [
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'my', name: 'မြန်မာ', flag: '🇲🇲' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 实现搜索功能
    console.log('Search query:', searchQuery);
  };

  return (
    <Navbar expand="lg" className="navbar-custom" fixed="top">
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <FaMusic className="me-2" style={{ color: 'var(--primary-color)' }} />
          <span className="fw-bold" style={{ color: 'var(--text-light)' }}>
            {translations.title}
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" className="d-flex align-items-center">
              <FaHome className="me-1" />
              {translations.nav.home}
            </Nav.Link>
            <Nav.Link href="/music" className="d-flex align-items-center">
              <FaMusic className="me-1" />
              {translations.nav.music}
            </Nav.Link>
            <Nav.Link href="/dj" className="d-flex align-items-center">
              <FaBroadcastTower className="me-1" />
              {translations.nav.dj}
            </Nav.Link>
            <Nav.Link href="/ranking" className="d-flex align-items-center">
              <FaTrophy className="me-1" />
              {translations.nav.ranking}
            </Nav.Link>
            <Nav.Link href="/rules" className="d-flex align-items-center">
              <FaFileContract className="me-1" />
              规则条款
            </Nav.Link>
          </Nav>

          {/* 搜索框 */}
          <Form className="d-flex me-3" onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder={translations.common.search}
              className="search-input me-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '200px' }}
            />
            <Button variant="outline-light" type="submit">
              <FaSearch />
            </Button>
          </Form>

          {/* 语言切换器 */}
          <Dropdown className="me-3">
            <Dropdown.Toggle variant="outline-light" className="language-switcher">
              {languages.find(lang => lang.code === currentLang)?.flag} {' '}
              {languages.find(lang => lang.code === currentLang)?.name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {languages.map((lang) => (
                <Dropdown.Item
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  active={currentLang === lang.code}
                >
                  {lang.flag} {lang.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* 用户菜单 */}
          <Dropdown>
            <Dropdown.Toggle variant="outline-light">
              <FaUser className="me-1" />
              {translations.nav.profile}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="/login">
                {translations.nav.login}
              </Dropdown.Item>
              <Dropdown.Item href="/register">
                {translations.nav.register}
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="/profile">
                {translations.profile.myProfile}
              </Dropdown.Item>
              <Dropdown.Item href="/wallet">
                {translations.profile.myWallet}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;

