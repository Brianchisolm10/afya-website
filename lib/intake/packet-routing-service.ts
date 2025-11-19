/**
 * Packet Routing Service
 * 
 * Determines which packets should be generated based on client type and intake responses
 */

import { prisma } from '@/lib/db';
import { ClientType, PacketType, PacketStatus } from '@prisma/client';
import { IntakeResponses } from '@/types/intake';

export class PacketRoutingService {
  /**
   * Determine required packet types based on client type
   */
  static determineRequiredPackets(
    clientType: ClientType,
    responses: IntakeResponses
  ): PacketType[] {
    const packets: PacketType[] = [];

    switch (clientType) {
      case 'NUTRITION_ONLY':
        // Only nutrition packet
        packets.push('NUTRITION');
        break;

      case 'WORKOUT_ONLY':
        // Only workout packet
        packets.push('WORKOUT');
        break;

      case 'FULL_PROGRAM':
        // Both nutrition and workout packets
        packets.push('NUTRITION', 'WORKOUT');
        break;

      case 'ATHLETE_PERFORMANCE':
        // Performance workout packet
        packets.push('PERFORMANCE');
        
        // Optional nutrition packet if requested
        if (responses['include-nutrition'] === 'yes') {
          packets.push('NUTRITION');
        }
        break;

      case 'YOUTH':
        // Youth-specific packet
        packets.push('YOUTH');
        break;

      case 'GENERAL_WELLNESS':
        // Wellness packet
        packets.push('WELLNESS');
        
        // Add workout if exercise is a focus
        const wellnessFocus = responses['wellness-focus'];
        if (Array.isArray(wellnessFocus) && 
            (wellnessFocus.includes('strength') || 
             wellnessFocus.includes('endurance') || 
             wellnessFocus.includes('mobility'))) {
          packets.push('WORKOUT');
        }
        
        // Add nutrition if weight/energy is a focus
        if (Array.isArray(wellnessFocus) && 
            (wellnessFocus.includes('weight') || 
             wellnessFocus.includes('energy'))) {
          packets.push('NUTRITION');
        }
        break;

      case 'SPECIAL_SITUATION':
        // Recovery packet
        packets.push('RECOVERY');
        
        // Add nutrition if recovery goals include it
        const recoveryGoals = responses['recovery-goals'];
        if (typeof recoveryGoals === 'string' && 
            recoveryGoals.toLowerCase().includes('nutrition')) {
          packets.push('NUTRITION');
        }
        break;

      default:
        // Default to intro packet
        packets.push('INTRO');
    }

    // Always include intro packet if no other packets
    if (packets.length === 0) {
      packets.push('INTRO');
    }

    return packets;
  }

  /**
   * Queue packet generation for a client
   */
  static async queuePacketGeneration(
    clientId: string,
    packetType: PacketType
  ): Promise<string> {
    const packet = await prisma.packet.create({
      data: {
        clientId,
        type: packetType,
        status: 'PENDING',
        generatedBy: 'SYSTEM',
        generationMethod: 'TEMPLATE'
      }
    });

    return packet.id;
  }

  /**
   * Queue multiple packets for a client
   */
  static async queueMultiplePackets(
    clientId: string,
    packetTypes: PacketType[]
  ): Promise<string[]> {
    const packetIds: string[] = [];

    for (const packetType of packetTypes) {
      const packetId = await this.queuePacketGeneration(clientId, packetType);
      packetIds.push(packetId);
    }

    return packetIds;
  }

  /**
   * Get packet status
   */
  static async getPacketStatus(packetId: string): Promise<PacketStatus | null> {
    const packet = await prisma.packet.findUnique({
      where: { id: packetId },
      select: { status: true }
    });

    return packet?.status || null;
  }

  /**
   * Get all packets for a client
   */
  static async getClientPackets(clientId: string) {
    return await prisma.packet.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Route packets after intake submission
   */
  static async routePacketsForClient(
    clientId: string,
    clientType: ClientType,
    responses: IntakeResponses
  ): Promise<{ packetIds: string[]; packetTypes: PacketType[] }> {
    // Determine required packets
    const packetTypes = this.determineRequiredPackets(clientType, responses);

    // Queue packets for generation
    const packetIds = await this.queueMultiplePackets(clientId, packetTypes);

    return {
      packetIds,
      packetTypes
    };
  }
}
