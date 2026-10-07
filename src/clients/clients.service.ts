import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async createClient(
    createClientDto: CreateClientDto,
    createdById: string,
  ) {
    const { name, email, password } = createClientDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        userType: 'CLIENT',
        createdById,
      },
    });

    return {
      message: 'Client created successfully',
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        userType: client.userType,
      },
    };
  }

  async assignModulesToClient(
    clientId: string,
    moduleIds: string[],
  ) {
    // 1. Check client exists
    const client = await this.prisma.user.findUnique({
      where: {
        id: clientId,
      },
    });

    if (!client || client.userType !== 'CLIENT') {
      throw new ConflictException('Client not found');
    }

    // 2. Check all modules exist
    const modules = await this.prisma.module.findMany({
      where: {
        id: {
          in: moduleIds,
        },
      },
    });

    if (modules.length !== moduleIds.length) {
      throw new ConflictException(
        'One or more modules not found',
      );
    }

    // 3. Assign modules to client
    await this.prisma.clientModule.createMany({
      data: moduleIds.map((moduleId) => ({
        clientId,
        moduleId,
      })),
      skipDuplicates: true,
    });

    return {
      message: 'Modules assigned to client successfully',
      clientId,
      moduleIds,
    };
  }

  async getClientModules(clientId: string) {
    const client = await this.prisma.user.findUnique({
      where: {
        id: clientId,
      },
    });

    if (!client || client.userType !== 'CLIENT') {
      throw new ConflictException('Client not found');
    }

    const clientModules =
      await this.prisma.clientModule.findMany({
        where: {
          clientId,
        },
        include: {
          module: true,
        },
      });

    return {
      clientId,
      modules: clientModules.map((item) => ({
        id: item.module.id,
        name: item.module.name,
      })),
    };
  }

  async createClientRole(
    clientId: string,
    name: string,
  ) {
    // 1. Check client exists
    const client = await this.prisma.user.findUnique({
      where: {
        id: clientId,
      },
    });

    if (!client || client.userType !== 'CLIENT') {
      throw new ConflictException('Client not found');
    }

    // 2. Check role already exists
    const existingRole = await this.prisma.role.findUnique({
      where: {
        clientId_name: {
          clientId,
          name,
        },
      },
    });

    if (existingRole) {
      throw new ConflictException(
        'Role already exists for this client',
      );
    }

    // 3. Create role
    const role = await this.prisma.role.create({
      data: {
        name,
        clientId,
      },
    });

    return {
      message: 'Role created successfully',
      role: {
        id: role.id,
        name: role.name,
        clientId: role.clientId,
      },
    };
  }

  async assignModulesToRole(
    clientId: string,
    roleId: string,
    moduleIds: string[],
  ) {
    // 1. Check authenticated user is a CLIENT
    const client = await this.prisma.user.findUnique({
      where: {
        id: clientId,
      },
    });

    if (!client || client.userType !== 'CLIENT') {
      throw new ForbiddenException(
        'Only clients can assign modules to roles',
      );
    }

    // 2. Check role belongs to this client
    const role = await this.prisma.role.findFirst({
      where: {
        id: roleId,
        clientId,
      },
    });

    if (!role) {
      throw new ConflictException(
        'Role not found for this client',
      );
    }

    // 3. Check modules are assigned to this client
    const clientModules =
      await this.prisma.clientModule.findMany({
        where: {
          clientId,
          moduleId: {
            in: moduleIds,
          },
        },
      });

    if (clientModules.length !== moduleIds.length) {
      throw new ConflictException(
        'One or more modules are not assigned to this client',
      );
    }

    // 4. Assign modules to role
    await this.prisma.roleModule.createMany({
      data: moduleIds.map((moduleId) => ({
        roleId,
        moduleId,
      })),
      skipDuplicates: true,
    });

    return {
      message: 'Modules assigned to role successfully',
      roleId,
      moduleIds,
    };
  }

  
  async getRoleModules(
  clientId: string,
  roleId: string,
) {
  // 1. Check client exists
  const client = await this.prisma.user.findUnique({
    where: {
      id: clientId,
    },
  });

  if (!client || client.userType !== 'CLIENT') {
    throw new ForbiddenException(
      'Only clients can access role modules',
    );
  }

  // 2. Check role belongs to this client
  const role = await this.prisma.role.findFirst({
    where: {
      id: roleId,
      clientId,
    },
  });

  if (!role) {
    throw new ConflictException(
      'Role not found for this client',
    );
  }

  // 3. Get modules assigned to role
  const roleModules = await this.prisma.roleModule.findMany({
    where: {
      roleId,
    },
    include: {
      module: true,
    },
  });

  return {
    roleId,
    roleName: role.name,
    modules: roleModules.map((item) => ({
      id: item.module.id,
      name: item.module.name,
    })),
  };
}
}