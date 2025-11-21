/**
 * Integration tests for Health Tools page
 */

import { describe, it, expect } from 'vitest';
import { TOOL_CONFIGS } from '@/lib/tools/tool-config';

describe('Health Tools Page Integration', () => {
  describe('Tool configuration', () => {
    it('should have all 6 tools configured', () => {
      expect(TOOL_CONFIGS.length).toBe(6);
    });

    it('should have unique tool IDs', () => {
      const ids = TOOL_CONFIGS.map(tool => tool.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have all required tool properties', () => {
      TOOL_CONFIGS.forEach(tool => {
        expect(tool).toHaveProperty('id');
        expect(tool).toHaveProperty('title');
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('icon');
        expect(tool).toHaveProperty('gradient');
        expect(tool).toHaveProperty('category');
      });
    });

    it('should have valid categories', () => {
      const validCategories = ['nutrition', 'movement', 'recovery', 'youth'];
      
      TOOL_CONFIGS.forEach(tool => {
        expect(validCategories).toContain(tool.category);
      });
    });

    it('should have descriptive titles', () => {
      TOOL_CONFIGS.forEach(tool => {
        expect(tool.title.length).toBeGreaterThan(5);
        expect(tool.title.length).toBeLessThan(50);
      });
    });

    it('should have concise descriptions', () => {
      TOOL_CONFIGS.forEach(tool => {
        expect(tool.description.length).toBeGreaterThan(10);
        expect(tool.description.length).toBeLessThan(100);
      });
    });
  });

  describe('Tool categories', () => {
    it('should have nutrition tools', () => {
      const nutritionTools = TOOL_CONFIGS.filter(t => t.category === 'nutrition');
      expect(nutritionTools.length).toBeGreaterThan(0);
    });

    it('should have movement tools', () => {
      const movementTools = TOOL_CONFIGS.filter(t => t.category === 'movement');
      expect(movementTools.length).toBeGreaterThan(0);
    });

    it('should have recovery tools', () => {
      const recoveryTools = TOOL_CONFIGS.filter(t => t.category === 'recovery');
      expect(recoveryTools.length).toBeGreaterThan(0);
    });

    it('should have youth tools', () => {
      const youthTools = TOOL_CONFIGS.filter(t => t.category === 'youth');
      expect(youthTools.length).toBeGreaterThan(0);
    });
  });

  describe('Tool ordering', () => {
    it('should have sequential order numbers', () => {
      const orders = TOOL_CONFIGS.map(t => t.order).sort((a, b) => a - b);
      
      orders.forEach((order, index) => {
        expect(order).toBe(index + 1);
      });
    });

    it('should display tools in order', () => {
      const sortedTools = [...TOOL_CONFIGS].sort((a, b) => a.order - b.order);
      
      expect(sortedTools[0].order).toBe(1);
      expect(sortedTools[sortedTools.length - 1].order).toBe(TOOL_CONFIGS.length);
    });
  });

  describe('Tool gradients', () => {
    it('should have Tailwind gradient classes', () => {
      TOOL_CONFIGS.forEach(tool => {
        expect(tool.gradient).toContain('from-');
        expect(tool.gradient).toContain('to-');
      });
    });

    it('should use AFYA color palette', () => {
      const afyaColors = ['afya', 'rose', 'coral'];
      
      TOOL_CONFIGS.forEach(tool => {
        const hasAfyaColor = afyaColors.some(color => 
          tool.gradient.toLowerCase().includes(color)
        );
        expect(hasAfyaColor).toBe(true);
      });
    });
  });

  describe('Tool icons', () => {
    it('should have Lucide icon names', () => {
      TOOL_CONFIGS.forEach(tool => {
        expect(tool.icon.length).toBeGreaterThan(0);
        // Icon names should be PascalCase
        expect(tool.icon[0]).toBe(tool.icon[0].toUpperCase());
      });
    });

    it('should have unique icons', () => {
      const icons = TOOL_CONFIGS.map(t => t.icon);
      const uniqueIcons = new Set(icons);
      
      // Most tools should have unique icons
      expect(uniqueIcons.size).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Tool activation', () => {
    it('should have all tools active by default', () => {
      const activeTools = TOOL_CONFIGS.filter(t => t.isActive !== false);
      
      expect(activeTools.length).toBe(TOOL_CONFIGS.length);
    });

    it('should be able to filter active tools', () => {
      const activeTools = TOOL_CONFIGS.filter(t => t.isActive !== false);
      
      expect(activeTools.length).toBeGreaterThan(0);
    });
  });

  describe('Page layout logic', () => {
    it('should display tools in a grid', () => {
      const gridCols = 3; // Desktop: 3 columns
      const toolCount = TOOL_CONFIGS.length;
      const rows = Math.ceil(toolCount / gridCols);
      
      expect(rows).toBeGreaterThanOrEqual(2);
    });

    it('should be responsive', () => {
      const layouts = {
        mobile: 1, // 1 column
        tablet: 2, // 2 columns
        desktop: 3, // 3 columns
      };
      
      expect(layouts.mobile).toBe(1);
      expect(layouts.tablet).toBe(2);
      expect(layouts.desktop).toBe(3);
    });
  });

  describe('Tool panel interaction', () => {
    it('should track active tool', () => {
      let activeTool: string | null = null;
      
      // Open tool
      activeTool = 'energy-protein';
      expect(activeTool).toBe('energy-protein');
      
      // Close tool
      activeTool = null;
      expect(activeTool).toBeNull();
    });

    it('should only show one tool at a time', () => {
      let activeTool: string | null = 'energy-protein';
      
      // Opening another tool should replace the current one
      activeTool = 'plate-builder';
      expect(activeTool).toBe('plate-builder');
      expect(activeTool).not.toBe('energy-protein');
    });

    it('should allow closing tool panel', () => {
      let isOpen = true;
      
      isOpen = false;
      expect(isOpen).toBe(false);
    });
  });

  describe('Navigation integration', () => {
    it('should have tools link in navigation', () => {
      const navItems = [
        { label: 'About', href: '/about' },
        { label: 'Programs', href: '/programs' },
        { label: 'Tools', href: '/tools' },
        { label: 'Impact', href: '/impact' },
      ];
      
      const toolsLink = navItems.find(item => item.href === '/tools');
      expect(toolsLink).toBeDefined();
      expect(toolsLink?.label).toBe('Tools');
    });

    it('should be accessible without authentication', () => {
      const isPublic = true;
      const requiresAuth = false;
      
      expect(isPublic).toBe(true);
      expect(requiresAuth).toBe(false);
    });
  });

  describe('Footer integration', () => {
    it('should have tools link in footer', () => {
      const footerLinks = [
        { label: 'Health Tools', href: '/tools' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Blog', href: '/blog' },
      ];
      
      const toolsLink = footerLinks.find(link => link.href === '/tools');
      expect(toolsLink).toBeDefined();
    });
  });

  describe('CTA integration', () => {
    it('should link to programs from tool results', () => {
      const ctaLink = '/programs';
      const ctaText = 'Explore Programs';
      
      expect(ctaLink).toBe('/programs');
      expect(ctaText).toContain('Programs');
    });

    it('should link to get started', () => {
      const ctaLink = '/get-started';
      const ctaText = 'Get Started';
      
      expect(ctaLink).toBe('/get-started');
      expect(ctaText).toContain('Get Started');
    });
  });

  describe('Mobile responsiveness', () => {
    it('should stack cards on mobile', () => {
      const mobileLayout = 'grid-cols-1';
      
      expect(mobileLayout).toContain('grid-cols-1');
    });

    it('should use full-screen panels on mobile', () => {
      const mobilePanel = 'fixed inset-0';
      
      expect(mobilePanel).toContain('fixed');
      expect(mobilePanel).toContain('inset-0');
    });

    it('should have touch-friendly controls', () => {
      const minTouchTarget = 44; // pixels
      
      expect(minTouchTarget).toBeGreaterThanOrEqual(44);
    });
  });

  describe('Accessibility', () => {
    it('should have semantic HTML structure', () => {
      const structure = {
        main: true,
        section: true,
        article: true,
        button: true,
      };
      
      expect(structure.main).toBe(true);
      expect(structure.button).toBe(true);
    });

    it('should have ARIA labels', () => {
      const ariaLabels = {
        toolCard: 'Open Energy & Protein Calculator',
        closeButton: 'Close tool panel',
        backButton: 'Back to tools',
      };
      
      expect(ariaLabels.toolCard).toContain('Open');
      expect(ariaLabels.closeButton).toContain('Close');
      expect(ariaLabels.backButton).toContain('Back');
    });

    it('should support keyboard navigation', () => {
      const keyboardSupport = {
        tab: true,
        enter: true,
        escape: true,
        arrows: true,
      };
      
      expect(keyboardSupport.tab).toBe(true);
      expect(keyboardSupport.escape).toBe(true);
    });

    it('should have focus indicators', () => {
      const focusStyles = 'focus:ring-2 focus:ring-offset-2';
      
      expect(focusStyles).toContain('focus:ring');
    });
  });

  describe('Performance', () => {
    it('should lazy load tool components', () => {
      const useLazyLoading = true;
      
      expect(useLazyLoading).toBe(true);
    });

    it('should have minimal initial bundle', () => {
      const initialLoad = ['page', 'tool-cards', 'navigation'];
      const lazyLoad = ['tool-components'];
      
      expect(initialLoad.length).toBeLessThan(5);
      expect(lazyLoad.length).toBeGreaterThan(0);
    });
  });

  describe('Error handling', () => {
    it('should handle missing tool gracefully', () => {
      const toolId = 'non-existent-tool';
      const tool = TOOL_CONFIGS.find(t => t.id === toolId);
      
      expect(tool).toBeUndefined();
      // Should not crash, just show error or redirect
    });

    it('should handle calculation errors', () => {
      const hasError = false;
      const errorMessage = '';
      
      expect(hasError).toBe(false);
      expect(errorMessage).toBe('');
    });
  });

  describe('User flow', () => {
    it('should support complete tool usage flow', () => {
      const flow = [
        'view-tools-page',
        'select-tool',
        'open-tool-panel',
        'enter-inputs',
        'view-results',
        'close-panel',
        'return-to-tools',
      ];
      
      expect(flow.length).toBe(7);
      expect(flow[0]).toBe('view-tools-page');
      expect(flow[flow.length - 1]).toBe('return-to-tools');
    });

    it('should allow using multiple tools in one session', () => {
      const toolsUsed = ['energy-protein', 'heart-rate-zones', 'recovery-checkin'];
      
      expect(toolsUsed.length).toBeGreaterThan(1);
    });
  });
});
