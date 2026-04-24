import { describe, expect, it } from "vitest";
import { parseCidr } from "./cidr";

describe("cidr", () => {
  it("normalizes an IPv4 host address to its network", () => {
    const { info, error } = parseCidr("192.168.1.37/24");
    expect(error).toBeNull();
    expect(info?.network).toBe("192.168.1.0");
    expect(info?.broadcast).toBe("192.168.1.255");
    expect(info?.firstHost).toBe("192.168.1.1");
    expect(info?.lastHost).toBe("192.168.1.254");
    expect(info?.usableHostCount).toBe("254");
    expect(info?.totalHostCount).toBe("256");
    expect(info?.netmask).toBe("255.255.255.0");
    expect(info?.wildcard).toBe("0.0.0.255");
    expect(info?.ipClass).toBe("C");
    expect(info?.isPrivate).toBe(true);
  });

  it("handles /31 point-to-point links (2 addresses, both usable)", () => {
    const { info } = parseCidr("10.0.0.0/31");
    expect(info?.totalHostCount).toBe("2");
    expect(info?.usableHostCount).toBe("2");
    expect(info?.firstHost).toBe("10.0.0.0");
    expect(info?.lastHost).toBe("10.0.0.1");
  });

  it("handles /32 single-host prefix", () => {
    const { info } = parseCidr("8.8.8.8/32");
    expect(info?.network).toBe("8.8.8.8");
    expect(info?.broadcast).toBe("8.8.8.8");
    expect(info?.usableHostCount).toBe("1");
    expect(info?.ipClass).toBe("A");
    expect(info?.isPrivate).toBe(false);
  });

  it("treats a bare IPv4 as /32", () => {
    const { info } = parseCidr("1.2.3.4");
    expect(info?.prefix).toBe(32);
    expect(info?.network).toBe("1.2.3.4");
  });

  it("flags loopback, link-local, and multicast IPv4", () => {
    expect(parseCidr("127.0.0.1").info?.isLoopback).toBe(true);
    expect(parseCidr("169.254.1.1").info?.isLinkLocal).toBe(true);
    expect(parseCidr("224.0.0.1").info?.isMulticast).toBe(true);
  });

  it("rejects malformed IPv4", () => {
    expect(parseCidr("256.0.0.1").error).toBe("Invalid IPv4 address");
    expect(parseCidr("1.2.3").error).toBe("Invalid IPv4 address");
    expect(parseCidr("1.2.3.4/33").error).toMatch(/prefix/i);
  });

  it("parses IPv6 with :: compression", () => {
    const { info, error } = parseCidr("2001:db8::/32");
    expect(error).toBeNull();
    expect(info?.version).toBe(6);
    expect(info?.prefix).toBe(32);
    expect(info?.network).toBe("2001:db8::");
    expect(info?.totalHostCount).toBe((1n << 96n).toString());
  });

  it("parses IPv6 link-local and handles embedded IPv4", () => {
    expect(parseCidr("fe80::1").info?.isLinkLocal).toBe(true);
    expect(parseCidr("::ffff:192.0.2.1").info?.version).toBe(6);
  });

  it("normalizes IPv6 host bits within the prefix", () => {
    const { info } = parseCidr("2001:db8:abcd:0012:1234::/48");
    expect(info?.network).toBe("2001:db8:abcd::");
    expect(info?.rangeEnd).toMatch(/^2001:db8:abcd:ffff:ffff:ffff:ffff:ffff$/i);
  });

  it("rejects invalid IPv6", () => {
    expect(parseCidr("2001::db8::1").error).toBe("Invalid IPv6 address");
    expect(parseCidr("gggg::/16").error).toBe("Invalid IPv6 address");
    expect(parseCidr("::/129").error).toMatch(/prefix/i);
  });
});
