/**
 * The world this widget simulates: one LAN (one broadcast domain) with two
 * routers, each running its own DHCP server on a *different* subnet. The whole
 * lesson turns on one honest computation — `sameSubnet` — so reachability is
 * derived from the leases the learner sees, never asserted by the script.
 */

export interface Router {
  id: 'a' | 'b';
  label: string;
  /** Network address shown to the learner, e.g. "192.168.1.0". */
  network: string;
  /** First three octets — the /24 prefix two hosts must share to talk directly. */
  prefix: string;
  gateway: string;
  subnetLabel: string;
  poolLabel: string;
}

export interface Device {
  id: 'laptop' | 'phone';
  label: string;
  icon: string;
}

export interface Lease {
  deviceId: Device['id'];
  routerId: Router['id'];
  ip: string;
  gateway: string;
  prefix: string;
  subnetLabel: string;
}

export const ROUTER_A: Router = {
  id: 'a',
  label: 'Router A',
  network: '192.168.1.0',
  prefix: '192.168.1',
  gateway: '192.168.1.1',
  subnetLabel: '192.168.1.0/24',
  poolLabel: '192.168.1.100 – .150',
};

export const ROUTER_B: Router = {
  id: 'b',
  label: 'Router B',
  network: '192.168.0.0',
  prefix: '192.168.0',
  gateway: '192.168.0.1',
  subnetLabel: '192.168.0.0/24',
  poolLabel: '192.168.0.100 – .150',
};

export const ROUTERS: readonly Router[] = [ROUTER_A, ROUTER_B];

export const LAPTOP: Device = {id: 'laptop', label: 'Laptop', icon: '💻'};
export const PHONE: Device = {id: 'phone', label: 'Phone', icon: '📱'};
export const DEVICES: readonly Device[] = [LAPTOP, PHONE];

function leaseFrom(router: Router, deviceId: Device['id'], lastOctet: number): Lease {
  return {
    deviceId,
    routerId: router.id,
    ip: `${router.prefix}.${lastOctet}`,
    gateway: router.gateway,
    prefix: router.prefix,
    subnetLabel: router.subnetLabel,
  };
}

/**
 * The scripted lease each step hands out. Because DHCP is a race between the
 * two servers, *which* one answers is unpredictable in real life; the guided
 * walkthrough fixes the winners so the split (and its fix) are legible.
 */
export const SCRIPT = {
  /** Step 2: the laptop's DISCOVER is answered by Router A. */
  laptopFromA: leaseFrom(ROUTER_A, 'laptop', 100),
  /** Step 3: the phone's DISCOVER is answered by Router B — the other subnet. */
  phoneFromB: leaseFrom(ROUTER_B, 'phone', 100),
  /** Step 6: with Router B's DHCP off, both renew from Router A. */
  laptopFromAAgain: leaseFrom(ROUTER_A, 'laptop', 100),
  phoneFromA: leaseFrom(ROUTER_A, 'phone', 101),
} as const;

/** Two hosts can talk directly only if they share a /24 prefix. */
export function sameSubnet(a: Lease, b: Lease): boolean {
  return a.prefix === b.prefix;
}

export type LeaseMap = Partial<Record<Device['id'], Lease>>;
