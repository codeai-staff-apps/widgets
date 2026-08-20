import Button from '@code-dot-org/component-library/button';

import {DEVICES, ROUTER_A, ROUTER_B, type LeaseMap, type Router} from './network';

import './lan.css';

export type LinkState = 'idle' | 'split' | 'connected';

/**
 * An action the walkthrough wants performed *on a card*. It is supplied only
 * when that click is the current on-rails step, so a card's button simply does
 * not exist at any other time — there is no way to click ahead or out of turn.
 */
export interface CardAction {
  label: string;
  ariaLabel: string;
  onClick: () => void;
}

/** A card button that pulses to invite the one click the current step expects. */
function FlashingButton({action}: {action: CardAction}) {
  return (
    <span className="cardBtnWrap cardBtnWrap--flash">
      <Button size="s" text={action.label} ariaLabel={action.ariaLabel} onClick={action.onClick} />
    </span>
  );
}

function RouterCard({
  router,
  dhcpOn,
  action,
}: {
  router: Router;
  dhcpOn: boolean;
  action?: CardAction;
}) {
  return (
    <div className={`router router--${router.id} ${dhcpOn ? '' : 'router--off'}`}>
      <div className="router__head">
        <span className="router__name">{router.label}</span>
        <span className={`badge ${dhcpOn ? 'badge--on' : 'badge--off'}`}>
          {dhcpOn ? 'DHCP ON' : 'DHCP OFF'}
        </span>
      </div>
      <dl className="router__facts">
        <div>
          <dt>Subnet</dt>
          <dd>{router.subnetLabel}</dd>
        </div>
        <div>
          <dt>Gateway</dt>
          <dd>{router.gateway}</dd>
        </div>
        <div className={dhcpOn ? '' : 'is-muted'}>
          <dt>DHCP pool</dt>
          <dd>{dhcpOn ? router.poolLabel : 'access-point mode — hands out no addresses'}</dd>
        </div>
      </dl>
      {action && <FlashingButton action={action} />}
    </div>
  );
}

function DeviceCard({
  leases,
  deviceId,
  action,
}: {
  leases: LeaseMap;
  deviceId: 'laptop' | 'phone';
  action?: CardAction;
}) {
  const device = DEVICES.find(d => d.id === deviceId)!;
  const lease = leases[deviceId];
  return (
    <div className="device">
      <span className="device__icon" aria-hidden="true">
        {device.icon}
      </span>
      <span className="device__name">{device.label}</span>
      {lease ? (
        <span className={`chip chip--${lease.routerId}`}>
          <span className="chip__ip">{lease.ip}</span>
          <span className="chip__meta">
            via Router {lease.routerId.toUpperCase()} · gw {lease.gateway}
          </span>
        </span>
      ) : (
        <span className="chip chip--empty">waiting for an address…</span>
      )}
      {action && <FlashingButton action={action} />}
    </div>
  );
}

function Reachability({link, leases}: {link: LinkState; leases: LeaseMap}) {
  if (link === 'idle') {
    return null;
  }
  const laptop = leases.laptop;
  const phone = leases.phone;
  if (!laptop || !phone) {
    return null;
  }
  if (link === 'split') {
    return (
      <p className="reach reach--split" role="status">
        <span aria-hidden="true">⛔ </span>
        {laptop.ip} and {phone.ip} are on <strong>different subnets</strong> — the two devices
        can't reach each other, even on the same wire.
      </p>
    );
  }
  return (
    <p className="reach reach--ok" role="status">
      <span aria-hidden="true">✅ </span>
      {laptop.ip} and {phone.ip} share <strong>{laptop.subnetLabel}</strong> — the two devices can
      talk directly.
    </p>
  );
}

export default function LanDiagram({
  routerBDhcpOn,
  leases,
  link,
  deviceActions = {},
  routerBAction,
}: {
  routerBDhcpOn: boolean;
  leases: LeaseMap;
  link: LinkState;
  deviceActions?: Partial<Record<'laptop' | 'phone', CardAction>>;
  routerBAction?: CardAction;
}) {
  return (
    <div className="lan">
      <div className="lan__tier">
        <RouterCard router={ROUTER_A} dhcpOn />
        <RouterCard router={ROUTER_B} dhcpOn={routerBDhcpOn} action={routerBAction} />
      </div>
      <div className="lan__bus">
        <span className="lan__busLabel">LAN — one wire, one broadcast domain</span>
      </div>
      <div className="lan__tier">
        <DeviceCard leases={leases} deviceId="laptop" action={deviceActions.laptop} />
        <DeviceCard leases={leases} deviceId="phone" action={deviceActions.phone} />
      </div>
      <Reachability link={link} leases={leases} />
    </div>
  );
}
