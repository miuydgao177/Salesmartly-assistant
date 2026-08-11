(function () {
  'use strict';

  const PANEL_ID = 'salesmartly-test-assistant-panel';
  const DEFAULT_DOCK = { right: 20, bottom: 20 };
  const PANEL_MARGIN = 12;

  function getPanel() {
    return document.getElementById(PANEL_ID);
  }

  function clampPanelPosition(position, panel) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const panelWidth = panel.offsetWidth || 344;
    const panelHeight = panel.offsetHeight || 560;

    return {
      left: Math.min(
        Math.max(position.left, PANEL_MARGIN),
        Math.max(PANEL_MARGIN, viewportWidth - panelWidth - PANEL_MARGIN)
      ),
      top: Math.min(
        Math.max(position.top, PANEL_MARGIN),
        Math.max(PANEL_MARGIN, viewportHeight - panelHeight - PANEL_MARGIN)
      )
    };
  }

  function convertPanelPositionToDock(position, panel) {
    const clamped = clampPanelPosition(position, panel);
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const panelWidth = panel.offsetWidth || 344;
    const panelHeight = panel.offsetHeight || 560;

    return {
      right: Math.max(PANEL_MARGIN, viewportWidth - clamped.left - panelWidth),
      bottom: Math.max(PANEL_MARGIN, viewportHeight - clamped.top - panelHeight)
    };
  }

  function applyPanelDockPosition(position) {
    const panel = getPanel();
    if (!panel || !position) {
      return;
    }

    panel.style.removeProperty('left');
    panel.style.removeProperty('top');
    panel.style.right = `${position.right}px`;
    panel.style.bottom = `${position.bottom}px`;
    panel.style.transform = 'none';
  }

  function resetPanelDock(panel) {
    const target = panel || getPanel();
    if (!target) {
      return;
    }

    target.style.removeProperty('left');
    target.style.removeProperty('top');
    target.style.right = `${DEFAULT_DOCK.right}px`;
    target.style.bottom = `${DEFAULT_DOCK.bottom}px`;
    target.style.transform = 'none';
  }

  function enablePanelDragging() {
    const panel = getPanel();
    const handle = panel && panel.querySelector('.salesmartly-panel-header');
    if (!panel || !handle) {
      return;
    }

    let dragState = null;

    function stopDragging() {
      if (!dragState) {
        return;
      }

      panel.classList.remove('salesmartly-panel-dragging');
      const nextPosition = convertPanelPositionToDock(
        { left: dragState.left, top: dragState.top },
        panel
      );
      applyPanelDockPosition(nextPosition);
      dragState = null;
    }

    function handlePointerMove(event) {
      if (!dragState) {
        return;
      }

      dragState.left = event.clientX - dragState.offsetX;
      dragState.top = event.clientY - dragState.offsetY;

      if (dragState.rafId) {
        return;
      }

      dragState.rafId = window.requestAnimationFrame(() => {
        dragState.rafId = 0;
        const nextPosition = clampPanelPosition(
          { left: dragState.left, top: dragState.top },
          panel
        );
        panel.style.transform = `translate3d(${
          nextPosition.left - dragState.originLeft
        }px, ${nextPosition.top - dragState.originTop}px, 0)`;
      });
    }

    handle.addEventListener('pointerdown', (event) => {
      if (
        event.button !== 0 ||
        event.target.closest('button, select, textarea, input, option, summary')
      ) {
        return;
      }

      const rect = panel.getBoundingClientRect();
      dragState = {
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        left: rect.left,
        top: rect.top,
        originLeft: rect.left,
        originTop: rect.top,
        rafId: 0
      };

      panel.classList.add('salesmartly-panel-dragging');
      handle.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    handle.addEventListener('pointermove', handlePointerMove);
    handle.addEventListener('pointerup', stopDragging);
    handle.addEventListener('pointercancel', stopDragging);
  }

  globalThis.SALESMARTLY_PANEL_LAYOUT = {
    resetPanelDock,
    enablePanelDragging
  };
})();
