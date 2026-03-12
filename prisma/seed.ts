import { PrismaPg } from "@prisma/adapter-pg";
import {
  ApiKeyType,
  DigestFrequency,
  Environment,
  FeedbackStatus,
  NotificationChannel,
  NotificationStatus,
  NotificationType,
  PrismaClient,
} from "@/generated/prisma/client";
import "dotenv/config";
import { Pool } from "pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const result = await prisma.$transaction(async (tx) => {
    // 1. Seed User
    const argon2 = await import("argon2");
    const password = await argon2.hash("SlowMotion48.", {
      parallelism: 1,
    });
    const user = await tx.user.upsert({
      where: { email: "nedyudombat@gmail.com" },
      update: {},
      create: {
        email: "nedyudombat@gmail.com",
        firstName: "Nedy",
        lastName: "Udombat",
        phone: "+2348012345678",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nedy",
        emailVerified: true,
        emailVerifiedAt: new Date(),
        password,
        globalNotificationsEnabled: true,
        notificationChannels: [
          NotificationChannel.IN_APP,
          NotificationChannel.EMAIL,
        ],
        digestFrequency: DigestFrequency.REAL_TIME,
      },
    });
    console.log("User seeded:", user);

    // 2. Seed Project
    const project = await tx.project.create({
      data: {
        name: "E-Commerce Platform",
        ownerId: user.id,
        defaultEnvironment: Environment.DEVELOPMENT,
        eventNotifications: true,
        feedbackNotifications: true,
        systemNotifications: true,
        securityNotifications: true,
        autoArchive: false,
        retentionDays: 90,
      },
    });
    console.log("Project seeded:", project);

    // 3. Seed Ingestion API Key for Development
    const crypto = await import("node:crypto");

    // Development Ingestion Key
    const devPrefix = "il_pk_test";
    const devEntropy = crypto.randomBytes(32).toString("hex");
    const devApiKeyValue = `${devPrefix}_${devEntropy}`;
    const devApiKeyHash = crypto
      .createHash("sha256")
      .update(devApiKeyValue)
      .digest("hex");
    const devKeyHint = `${devPrefix}_${devEntropy.slice(0, 4)}...${devEntropy.slice(-4)}`;

    const devApiKey = await tx.apiKey.create({
      data: {
        name: "Development Ingestion Key",
        keyValue: devApiKeyValue,
        keyHash: devApiKeyHash,
        keyHint: devKeyHint,
        type: ApiKeyType.INGESTION,
        environment: Environment.DEVELOPMENT,
        projectId: project.id,
        createdById: user.id,
      },
    });
    console.log("Development API Key seeded:", devApiKey);

    // Production Ingestion Key
    const prodPrefix = "il_pk_live";
    const prodEntropy = crypto.randomBytes(32).toString("hex");
    const prodApiKeyValue = `${prodPrefix}_${prodEntropy}`;
    const prodApiKeyHash = crypto
      .createHash("sha256")
      .update(prodApiKeyValue)
      .digest("hex");
    const prodKeyHint = `${prodPrefix}_${prodEntropy.slice(0, 4)}...${prodEntropy.slice(-4)}`;

    const prodApiKey = await tx.apiKey.create({
      data: {
        name: "Production Ingestion Key",
        keyValue: prodApiKeyValue,
        keyHash: prodApiKeyHash,
        keyHint: prodKeyHint,
        type: ApiKeyType.INGESTION,
        environment: Environment.PRODUCTION,
        projectId: project.id,
        createdById: user.id,
        lastUsedAt: new Date(Date.now() - 3600000), // Used 1 hour ago
      },
    });
    console.log("Production API Key seeded:", prodApiKey);

    // Management Key (no keyValue stored for security)
    const mgmtPrefix = "il_sk_live";
    const mgmtEntropy = crypto.randomBytes(32).toString("hex");
    const mgmtApiKeyValue = `${mgmtPrefix}_${mgmtEntropy}`;
    const mgmtApiKeyHash = crypto
      .createHash("sha256")
      .update(mgmtApiKeyValue)
      .digest("hex");
    const mgmtKeyHint = `${mgmtPrefix}_${mgmtEntropy.slice(0, 4)}...${mgmtEntropy.slice(-4)}`;

    const mgmtApiKey = await tx.apiKey.create({
      data: {
        name: "Production Management Key",
        keyValue: null, // Management keys should not store plaintext
        keyHash: mgmtApiKeyHash,
        keyHint: mgmtKeyHint,
        type: ApiKeyType.MANAGEMENT,
        environment: Environment.PRODUCTION,
        projectId: project.id,
        createdById: user.id,
        lastUsedAt: new Date(Date.now() - 7200000), // Used 2 hours ago
      },
    });
    console.log("Management API Key seeded:", mgmtApiKey);

    // 4. Seed End Users (4 known + 2 anonymous)
    const endUsers = await Promise.all([
      tx.endUser.create({
        data: {
          anonymousId: crypto.randomUUID(),
          firstName: "Sarah",
          lastName: "Johnson",
          email: "sarah.johnson@example.com",
          externalUserId: "user_001",
          projectId: project.id,
        },
      }),
      tx.endUser.create({
        data: {
          anonymousId: crypto.randomUUID(),
          firstName: "Michael",
          lastName: "Chen",
          email: "michael.chen@example.com",
          externalUserId: "user_002",
          projectId: project.id,
        },
      }),
      tx.endUser.create({
        data: {
          anonymousId: crypto.randomUUID(),
          firstName: "Emily",
          lastName: "Rodriguez",
          email: "emily.rodriguez@example.com",
          externalUserId: "user_003",
          projectId: project.id,
        },
      }),
      tx.endUser.create({
        data: {
          anonymousId: crypto.randomUUID(),
          firstName: "David",
          lastName: "Kim",
          email: "david.kim@example.com",
          externalUserId: "user_004",
          projectId: project.id,
        },
      }),
      tx.endUser.create({
        data: {
          anonymousId: crypto.randomUUID(),
          firstName: "Anonymous",
          lastName: "User",
          email: "anon_1@anonymous.local",
          externalUserId: "anon_001",
          projectId: project.id,
        },
      }),
      tx.endUser.create({
        data: {
          anonymousId: crypto.randomUUID(),
          firstName: "Anonymous",
          lastName: "User",
          email: "anon_2@anonymous.local",
          externalUserId: "anon_002",
          projectId: project.id,
        },
      }),
    ]);
    console.log(`Seeded ${endUsers.length} end users`);

    // 5. Seed 70 Events across all 6 end users and 3 environments
    const baseTime = Date.now();
    const events = [];

    // Helper function to create realistic event flows
    const createUserFlow = async (
      endUser: (typeof endUsers)[0],
      userIndex: number,
      startOffset: number,
    ) => {
      const flows = [
        // Development events (40% of total)
        {
          env: "DEVELOPMENT",
          flow: [
            {
              name: "page_viewed",
              offset: 0,
              props: {
                page: "homepage",
                referrer: "https://google.com",
                session_id: `sess_dev_${userIndex}_1`,
              },
            },
            {
              name: "signup_started",
              offset: 2000,
              props: {
                source: "homepage_cta",
                session_id: `sess_dev_${userIndex}_1`,
              },
            },
            {
              name: "signup_completed",
              offset: 45000,
              props: {
                method: "email",
                plan: "free",
                session_id: `sess_dev_${userIndex}_1`,
              },
            },
            {
              name: "profile_updated",
              offset: 120000,
              props: {
                fields_updated: ["avatar", "bio"],
                session_id: `sess_dev_${userIndex}_1`,
              },
            },
            {
              name: "browse_products",
              offset: 180000,
              props: {
                category: "electronics",
                filters_applied: { price_max: 500, brand: "TechCo" },
                session_id: `sess_dev_${userIndex}_2`,
              },
            },
            {
              name: "product_viewed",
              offset: 195000,
              props: {
                product_id: "prod_12345",
                product_name: "Wireless Headphones",
                price: 149.99,
                session_id: `sess_dev_${userIndex}_2`,
              },
            },
            {
              name: "add_to_cart",
              offset: 210000,
              props: {
                product_id: "prod_12345",
                quantity: 1,
                cart_value: 149.99,
                session_id: `sess_dev_${userIndex}_2`,
              },
            },
          ],
        },
        // Production events (35% of total)
        {
          env: "PRODUCTION",
          flow: [
            {
              name: "login_attempted",
              offset: 300000,
              props: {
                method: "email",
                session_id: `sess_prod_${userIndex}_1`,
              },
            },
            {
              name: "login_succeeded",
              offset: 302000,
              props: {
                method: "email",
                remember_me: true,
                session_id: `sess_prod_${userIndex}_1`,
              },
            },
            {
              name: "dashboard_viewed",
              offset: 305000,
              props: {
                widgets_loaded: 5,
                session_id: `sess_prod_${userIndex}_1`,
              },
            },
            {
              name: "checkout_started",
              offset: 360000,
              props: {
                cart_items: 1,
                cart_value: 149.99,
                session_id: `sess_prod_${userIndex}_1`,
              },
            },
            {
              name: "payment_info_entered",
              offset: 420000,
              props: {
                payment_method: "credit_card",
                session_id: `sess_prod_${userIndex}_1`,
              },
            },
            {
              name: "order_completed",
              offset: 450000,
              props: {
                order_id: `ord_${userIndex}_${Date.now()}`,
                total: 149.99,
                items_count: 1,
                session_id: `sess_prod_${userIndex}_1`,
              },
            },
          ],
        },
        // Staging events (25% of total)
        {
          env: "STAGING",
          flow: [
            {
              name: "feature_flag_evaluated",
              offset: 500000,
              props: {
                flag_name: "new_checkout_flow",
                value: true,
                session_id: `sess_stg_${userIndex}_1`,
              },
            },
            {
              name: "wishlist_created",
              offset: 520000,
              props: {
                wishlist_name: "Holiday Shopping",
                session_id: `sess_stg_${userIndex}_1`,
              },
            },
            {
              name: "product_added_to_wishlist",
              offset: 540000,
              props: {
                product_id: "prod_67890",
                wishlist_id: "wl_001",
                session_id: `sess_stg_${userIndex}_1`,
              },
            },
            {
              name: "review_submitted",
              offset: 600000,
              props: {
                product_id: "prod_12345",
                rating: 5,
                review_length: 250,
                session_id: `sess_stg_${userIndex}_1`,
              },
            },
          ],
        },
      ];

      for (const { env, flow } of flows) {
        for (const event of flow) {
          events.push({
            eventName: event.name,
            eventTimestamp: new Date(baseTime - startOffset + event.offset),
            projectId: project.id,
            endUserId: endUser.id,
            environment: env as Environment,
            externalEventId: crypto.randomUUID(),
            properties: event.props,
            metadata: {
              browser: ["Chrome", "Firefox", "Safari", "Edge"][userIndex % 4],
              browser_version: ["120.0.0", "119.0.1", "17.2", "120.0.1"][
                userIndex % 4
              ],
              os: ["MacOS", "Windows", "Linux", "Android"][userIndex % 4],
              os_version: ["14.2", "11", "6.5.0", "14"][userIndex % 4],
              device_type: ["Desktop", "Mobile", "Tablet"][userIndex % 3],
              screen_width: [1920, 390, 768][userIndex % 3],
              screen_height: [1080, 844, 1024][userIndex % 3],
              current_url: `https://shop.naijamall.ng/${event.name}`,
              host: "shop.naijamall.ng",
              pathname: `/${event.name}`,
              referrer:
                userIndex % 2 === 0
                  ? "https://google.com"
                  : "https://shop.naijamall.ng",
              geoip_country_name: [
                "Nigeria",
                "Kenya",
                "South Africa",
                "Ghana",
                "Egypt",
                "Ethiopia",
              ][userIndex % 6],
              geoip_country_code: ["NG", "KE", "ZA", "GH", "EG", "ET"][
                userIndex % 6
              ],
              geoip_city_name: [
                "Lagos",
                "Nairobi",
                "Johannesburg",
                "Accra",
                "Cairo",
                "Addis Ababa",
              ][userIndex % 6],
              geoip_timezone: [
                "Africa/Lagos",
                "Africa/Nairobi",
                "Africa/Johannesburg",
                "Africa/Accra",
                "Africa/Cairo",
                "Africa/Addis_Ababa",
              ][userIndex % 6],
              lib: "insightloop-browser",
              lib_version: "1.102.1",
              ip: `105.112.${userIndex + 10}.${Math.floor(Math.random() * 255)}`,
              user_agent: [
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:119.0) Gecko/20100101 Firefox/119.0",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              ][userIndex % 4],
              locale: ["en-NG", "en-KE", "en-ZA", "en-GH", "ar-EG", "am-ET"][
                userIndex % 6
              ],
            },
          });
        }
      }
    };

    // Create flows for each user with different time offsets
    for (let i = 0; i < endUsers.length; i++) {
      await createUserFlow(endUsers[i], i, i * 86400000); // Offset by days
    }

    // Create additional events to reach 70 total
    const additionalEventsNeeded = 70 - events.length;
    for (let i = 0; i < additionalEventsNeeded; i++) {
      const userIndex = i % endUsers.length;
      const envs = [
        Environment.DEVELOPMENT,
        Environment.DEVELOPMENT,
        Environment.PRODUCTION,
        Environment.PRODUCTION,
        Environment.STAGING,
      ];
      events.push({
        eventName: [
          "search_performed",
          "filter_applied",
          "notification_clicked",
          "settings_updated",
          "share_clicked",
        ][i % 5],
        eventTimestamp: new Date(baseTime - i * 3600000),
        projectId: project.id,
        endUserId: endUsers[userIndex].id,
        environment: envs[i % 5],
        externalEventId: crypto.randomUUID(),
        properties: {
          search_query: "wireless headphones",
          results_count: 42,
          session_id: `sess_extra_${userIndex}_${i}`,
        },
        metadata: {
          browser: ["Chrome", "Firefox", "Safari"][i % 3],
          browser_version: ["120.0.0", "119.0.1", "17.2"][i % 3],
          os: ["Windows", "MacOS", "Android"][i % 3],
          os_version: ["11", "14.2", "14"][i % 3],
          device_type: ["Desktop", "Mobile"][i % 2],
          screen_width: [1920, 390][i % 2],
          screen_height: [1080, 844][i % 2],
          current_url: "https://shop.naijamall.ng/search",
          host: "shop.naijamall.ng",
          pathname: "/search",
          referrer: "https://google.com",
          geoip_country_name: ["Nigeria", "Ghana", "Kenya"][i % 3],
          geoip_country_code: ["NG", "GH", "KE"][i % 3],
          geoip_city_name: ["Abuja", "Kumasi", "Nairobi"][i % 3],
          geoip_timezone: ["Africa/Lagos", "Africa/Accra", "Africa/Nairobi"][
            i % 3
          ],
          lib: "insightloop-browser",
          lib_version: "1.102.1",
          ip: `102.89.${i}.${Math.floor(Math.random() * 255)}`,
          user_agent: [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
            "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
          ][i % 3],
          locale: ["en-NG", "en-GH", "en-KE"][i % 3],
        },
      });
    }

    const createdEvents = await tx.event.createMany({
      data: events,
    });
    console.log(`Seeded ${createdEvents.count} events`);

    // 6. Seed 15 Feedback items
    const feedbacks = [];
    const statuses = [
      FeedbackStatus.NEW,
      FeedbackStatus.IN_PROGRESS,
      FeedbackStatus.RESOLVED,
      FeedbackStatus.CLOSED,
    ];
    const ratings = [1, 2, 3, 4, 5];
    const feedbackUsers = [endUsers[0], endUsers[1], endUsers[2], endUsers[4]]; // 3 known + 1 anon

    const feedbackTemplates = [
      {
        title: "Checkout flow is confusing",
        message:
          "The checkout button is frozen if I add items to the cart. I have to refresh the page to complete my purchase.",
        additionalInfo:
          "This happens on both Chrome and Safari. Cart total shows incorrect amount.",
        rating: 2,
      },
      {
        title: "Love the new wishlist feature!",
        message:
          "The wishlist feature provides a smooth experience. Very intuitive and easy to use.",
        additionalInfo: "Would be great to share wishlists with friends.",
        rating: 5,
      },
      {
        title: null,
        message:
          "Sign in functionality doesn't work properly. Gets stuck on loading screen.",
        additionalInfo: null,
        rating: 1,
      },
      {
        title: "Product search is amazing",
        message:
          "Search results are relevant and load quickly. Filters work perfectly!",
        additionalInfo: null,
        rating: 5,
      },
      {
        title: "Mobile app crashes",
        message:
          "App crashes when I try to upload profile picture. Happens every time on iOS.",
        additionalInfo: "iPhone 13 Pro, iOS 17.2",
        rating: 1,
      },
      {
        title: null,
        message: "Notification settings are hard to find",
        additionalInfo: null,
        rating: 3,
      },
      {
        title: "Great customer support",
        message:
          "Support team was very helpful and resolved my issue within 24 hours.",
        additionalInfo: "Ticket #12345",
        rating: 5,
      },
      {
        title: "Payment processing is slow",
        message:
          "Takes over 30 seconds to process payment. Other sites are much faster.",
        additionalInfo: "Using Visa card",
        rating: 2,
      },
      {
        title: null,
        message: "Dashboard loads slowly on mobile",
        additionalInfo: null,
        rating: 3,
      },
      {
        title: "Product images don't load",
        message:
          "Images fail to load on product detail pages. Just see blank placeholders.",
        additionalInfo: "Happening on staging environment",
        rating: 2,
      },
      {
        title: "Excellent user experience",
        message:
          "The entire shopping experience from browse to checkout is seamless. Well designed!",
        additionalInfo: "Particularly like the one-click checkout option",
        rating: 5,
      },
      {
        title: "Filter options are limited",
        message:
          "Need more filter options for product search, especially price ranges.",
        additionalInfo: null,
        rating: 3,
      },
      {
        title: null,
        message: "Order history is incomplete",
        additionalInfo: null,
        rating: 2,
      },
      {
        title: "Wishlist sync works great",
        message:
          "Love that my wishlist syncs across all devices. No issues so far!",
        additionalInfo: "Using both web and mobile app",
        rating: 4,
      },
      {
        title: "Dark mode is broken",
        message:
          "Dark mode makes some text unreadable. White text on white background in several places.",
        additionalInfo: "Screenshots attached (not really, but would be)",
        rating: 2,
      },
    ];

    for (let i = 0; i < 15; i++) {
      const template = feedbackTemplates[i];
      const userIndex = i % feedbackUsers.length;
      const shouldOmitFields = Math.random() < 0.125; // 10-15% chance

      // Time variations
      let timeOffset: number;
      if (i % 3 === 0) {
        timeOffset = i * 86400000; // Days apart
      } else if (i % 3 === 1) {
        timeOffset = i * 3600000; // Hours apart
      } else {
        timeOffset = i * 60000; // Minutes apart
      }
      const envs = [
        Environment.DEVELOPMENT,
        Environment.DEVELOPMENT,
        Environment.PRODUCTION,
        Environment.PRODUCTION,
        Environment.STAGING,
      ];
      feedbacks.push({
        title: shouldOmitFields ? null : template.title,
        message: template.message,
        additionalInfo: shouldOmitFields ? null : template.additionalInfo,
        rating: ratings[i % 5],
        status: statuses[i % 4],
        feedbackTimestamp: new Date(baseTime - timeOffset),
        projectId: project.id,
        endUserId: feedbackUsers[userIndex].id,
        environment: envs[i % 3],
        properties: {
          page: ["checkout", "product_detail", "dashboard", "search"][i % 4],
          component: [
            "checkout_button",
            "wishlist_icon",
            "login_form",
            "search_bar",
          ][i % 4],
          version: "2.1.0",
        },
        metadata: {
          browser: ["Chrome", "Safari", "Firefox", "Edge"][i % 4],
          browser_version: ["120.0.0", "17.2", "119.0", "120.0.1"][i % 4],
          os: ["Windows", "Android", "MacOS", "iOS"][i % 4],
          os_version: ["11", "14", "14.2", "17.2"][i % 4],
          device_type: ["Desktop", "Mobile", "Tablet"][i % 3],
          screen_width: [1920, 390, 768][i % 3],
          screen_height: [1080, 844, 1024][i % 3],
          current_url: `https://shop.naijamall.ng/${
            ["checkout", "products", "dashboard", "search"][i % 4]
          }`,
          host: "shop.naijamall.ng",
          pathname: `/${["checkout", "products", "dashboard", "search"][i % 4]}`,
          referrer:
            i % 2 === 0 ? "https://shop.naijamall.ng" : "https://google.com",
          geoip_country_name: ["Nigeria", "Kenya", "South Africa", "Ghana"][
            i % 4
          ],
          geoip_country_code: ["NG", "KE", "ZA", "GH"][i % 4],
          geoip_city_name: ["Port Harcourt", "Mombasa", "Cape Town", "Kumasi"][
            i % 4
          ],
          geoip_timezone: [
            "Africa/Lagos",
            "Africa/Nairobi",
            "Africa/Johannesburg",
            "Africa/Accra",
          ][i % 4],
          lib: "insightloop-browser",
          lib_version: "1.102.1",
          ip: `197.210.${i + 50}.${Math.floor(Math.random() * 255)}`,
          user_agent: [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.1",
          ][i % 4],
          locale: ["en-NG", "en-KE", "en-ZA", "en-GH"][i % 4],
          viewport_width: [1920, 390, 768][i % 3],
          viewport_height: [1080, 844, 1024][i % 3],
        },
      });
    }

    const createdFeedbacks = await tx.feedback.createMany({
      data: feedbacks,
    });
    console.log(`Seeded ${createdFeedbacks.count} feedbacks`);

    // 7. Seed Notifications
    const notifications = [];
    const notificationTemplates = [
      {
        title: "New feedback received",
        message: "Sarah Johnson submitted feedback about checkout flow",
        type: NotificationType.FEEDBACK,
        status: NotificationStatus.INFO,
        actionUrl: `/dashboard/${project.id}/feedback`,
        read: false,
      },
      {
        title: "High event volume detected",
        message: "Unusual spike in page_viewed events in the last hour",
        type: NotificationType.EVENT,
        status: NotificationStatus.WARNING,
        actionUrl: `/dashboard/${project.id}/events`,
        read: false,
      },
      {
        title: "API key expiring soon",
        message: "Your Production Management Key will expire in 30 days",
        type: NotificationType.SECURITY,
        status: NotificationStatus.WARNING,
        actionUrl: `/dashboard/${project.id}/settings/api-keys`,
        read: true,
      },
      {
        title: "Project created successfully",
        message: "E-Commerce Platform is ready to start collecting data",
        type: NotificationType.PROJECT,
        status: NotificationStatus.SUCCESS,
        actionUrl: `/dashboard/${project.id}`,
        read: true,
      },
      {
        title: "System maintenance scheduled",
        message:
          "Scheduled maintenance on March 15th from 2:00 AM - 4:00 AM UTC",
        type: NotificationType.SYSTEM,
        status: NotificationStatus.INFO,
        actionUrl: null,
        read: false,
      },
      {
        title: "Critical: Multiple login failures",
        message: "5 failed login attempts detected in the last 10 minutes",
        type: NotificationType.SECURITY,
        status: NotificationStatus.ERROR,
        actionUrl: "/settings/security",
        read: false,
      },
      {
        title: "Negative feedback alert",
        message: "3 low-rated feedback items received today",
        type: NotificationType.FEEDBACK,
        status: NotificationStatus.WARNING,
        actionUrl: `/dashboard/${project.id}/feedback?rating=1-2`,
        read: true,
      },
      {
        title: "Feature flag updated",
        message: "new_checkout_flow feature flag enabled in staging",
        type: NotificationType.PROJECT,
        status: NotificationStatus.INFO,
        actionUrl: `/dashboard/${project.id}/features`,
        read: true,
      },
    ];

    for (let i = 0; i < notificationTemplates.length; i++) {
      const template = notificationTemplates[i];
      notifications.push({
        title: template.title,
        message: template.message,
        type: template.type,
        status: template.status,
        notificationChannel: NotificationChannel.IN_APP,
        actionUrl: template.actionUrl,
        read: template.read,
        readAt: template.read ? new Date(baseTime - i * 3600000) : null,
        userId: user.id,
        projectId:
          template.type === NotificationType.SYSTEM ? null : project.id,
        data: {
          priority: ["low", "medium", "high"][i % 3],
          source: "system",
        },
      });
    }

    const createdNotifications = await tx.notification.createMany({
      data: notifications,
    });
    console.log(`Seeded ${createdNotifications.count} notifications`);

    // 8. Seed Sessions
    const sessions = [];
    const now = Date.now();

    // Active session
    sessions.push({
      userId: user.id,
      sessionId: crypto.randomUUID(),
      csrfToken: crypto.randomBytes(32).toString("hex"),
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      ip: "197.210.70.45",
      expiresAt: new Date(now + 7 * 24 * 60 * 60 * 1000), // 7 days
      maxExpiresAt: new Date(now + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    // Expired session
    sessions.push({
      userId: user.id,
      sessionId: crypto.randomUUID(),
      csrfToken: crypto.randomBytes(32).toString("hex"),
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X)",
      ip: "102.89.42.128",
      expiresAt: new Date(now - 7 * 24 * 60 * 60 * 1000), // Expired 7 days ago
      maxExpiresAt: new Date(now - 1 * 24 * 60 * 60 * 1000), // Max expired 1 day ago
    });

    // Revoked session
    sessions.push({
      userId: user.id,
      sessionId: crypto.randomUUID(),
      csrfToken: crypto.randomBytes(32).toString("hex"),
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      ip: "105.112.15.89",
      expiresAt: new Date(now + 7 * 24 * 60 * 60 * 1000),
      maxExpiresAt: new Date(now + 30 * 24 * 60 * 60 * 1000),
      revokedAt: new Date(now - 2 * 60 * 60 * 1000), // Revoked 2 hours ago
    });

    const createdSessions = await tx.session.createMany({
      data: sessions,
    });
    console.log(`Seeded ${createdSessions.count} sessions`);

    // 9. Seed Audit Logs
    const auditLogs = [];
    const auditActions = [
      {
        action: "user.login",
        metadata: { method: "email", success: true },
        timeOffset: 3600000,
      },
      {
        action: "project.created",
        metadata: { projectName: "E-Commerce Platform" },
        timeOffset: 7200000,
      },
      {
        action: "apikey.created",
        metadata: { keyType: "INGESTION", environment: "DEVELOPMENT" },
        timeOffset: 7300000,
      },
      {
        action: "apikey.created",
        metadata: { keyType: "INGESTION", environment: "PRODUCTION" },
        timeOffset: 7400000,
      },
      {
        action: "apikey.created",
        metadata: { keyType: "MANAGEMENT", environment: "PRODUCTION" },
        timeOffset: 7500000,
      },
      {
        action: "user.settings_updated",
        metadata: { changes: ["notificationChannels", "digestFrequency"] },
        timeOffset: 10800000,
      },
      {
        action: "project.settings_updated",
        metadata: { projectId: project.id, changes: ["retentionDays"] },
        timeOffset: 14400000,
      },
      {
        action: "feedback.viewed",
        metadata: { feedbackId: "feedback_123", status: "NEW" },
        timeOffset: 18000000,
      },
    ];

    for (const log of auditActions) {
      auditLogs.push({
        userId: user.id,
        action: log.action,
        metadata: log.metadata,
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        ip: "197.210.70.45",
        createdAt: new Date(now - log.timeOffset),
      });
    }

    const createdAuditLogs = await tx.auditLog.createMany({
      data: auditLogs,
    });
    console.log(`Seeded ${createdAuditLogs.count} audit logs`);

    return {
      user,
      project,
      endUsers,
      eventsCount: createdEvents.count,
      feedbacksCount: createdFeedbacks.count,
      notificationsCount: createdNotifications.count,
      sessionsCount: createdSessions.count,
      auditLogsCount: createdAuditLogs.count,
    };
  });

  console.log("\n==============================================");
  console.log("🎉 Seeding completed successfully!");
  console.log("==============================================\n");
  console.log("📊 Summary:");
  console.log("  User:", result.user.email);
  console.log("  Project:", result.project.name);
  console.log("  End Users:", result.endUsers.length);
  console.log("  Events:", result.eventsCount);
  console.log("  Feedbacks:", result.feedbacksCount);
  console.log("  Notifications:", result.notificationsCount);
  console.log("  Sessions:", result.sessionsCount);
  console.log("  Audit Logs:", result.auditLogsCount);
  console.log("\n🔑 API Keys created:");
  console.log("  - Development Ingestion Key");
  console.log("  - Production Ingestion Key");
  console.log("  - Production Management Key");
  console.log("\n✅ Database ready for development!");
  console.log("==============================================\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
